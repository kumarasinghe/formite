import {
  component$,
  Slot,
  useSignal,
  useVisibleTask$,
  $,
  QRL,
} from "@builder.io/qwik";

type ValidationStatus = undefined | "invalid" | "valid";

type Validator = RegExp | ((value: any)=>boolean) | {safeParse: (value: any)=>({success: boolean})}

export type ValidationStore = Record<
  string,
  { validator: Validator; status?: ValidationStatus }
>;

type FormProps = {
  validationStore: ValidationStore;
  onSubmit$: QRL<(formData: Record<string, unknown>)=> void>;
  class?: string;
};

export default component$((props: FormProps) => {
  const { validationStore, onSubmit$, class: className } = props;
  const formRef = useSignal<HTMLFormElement>();

  useVisibleTask$(() => {
    const form = formRef.value;
    if (!form) return;

    // iterate over validatable inputs
    for (const fieldName in validationStore) {
      const inputElement = form.elements[
        fieldName as keyof HTMLFormControlsCollection
      ] as HTMLInputElement;

      if (!inputElement) {
        console.error(`Unable to find the field "${fieldName}" for validation`);
        continue;
      }

      /* validate field after initial focus lost, followed by input changes */

      const handleInput = () => {
        const { value } = inputElement;
        const { validator } = validationStore[fieldName];
        let validationResult: unknown;

        // validator is a zod schema
        if ("safeParse" in validator) {
            validationResult = validator.safeParse(value)?.success;
        }
        // validator is a regex pattern
        else if (validator instanceof RegExp) {
          validationResult = value?.match?.(validator);
        }
        // validator is a function
        else if (typeof validator === "function") {
          validationResult = Boolean(validator(value));
        }

        validationStore[fieldName].status = validationResult
          ? "valid"
          : "invalid";
      };

      const handleBlur = () => {
        inputElement.removeEventListener("blur", handleBlur);
        handleInput();
        inputElement.addEventListener("input", handleInput);
      };

      inputElement.addEventListener("blur", handleBlur);
    }
  });

  const validateForm = $(() => {
    const form = formRef.value;
    if (!form) return;
    let formValidationStatus = true;

    for (const fieldName in validationStore) {
      // trigger validation if input has not been validated
      if (!validationStore[fieldName].status) {
        const inputElement = form[fieldName];
        inputElement.dispatchEvent(new Event("blur"));
      } 
      
      if (validationStore[fieldName]?.status === "invalid") {
        formValidationStatus = false;
      }
    }

    return formValidationStatus;
  });

  const handleSubmit = $(async () => {
    if (!await validateForm()) return;

    // build form data
    const formInputs = Array.from(formRef.value?.elements || []) as HTMLInputElement[];
    const formData:Record<string, unknown> = {};

    for (const inputElement of formInputs) {
      if (inputElement.name) {
        formData[inputElement.name] = inputElement.value;
      }
    }

    await onSubmit$(formData);
  });

  return (
    <form
      ref={formRef}
      class={className}
      onSubmit$={handleSubmit}
      preventdefault:submit
    >
      <Slot />
    </form>
  );
});

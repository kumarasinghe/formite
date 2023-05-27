import { component$, useStore, $ } from "@builder.io/qwik";
import Form, {ValidationStore} from "./index";
import "./root.css";

const LoginForm = component$(() => {
  const validationStore: ValidationStore = useStore({
    email: {
      validator: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      validator: /.{8,}/,
    },
  });

  const handleSubmit = $((formData: Record<string, unknown>) => {
    console.log("Form submitted!", formData);
  });

  return (
    <Form
      class="form"
      validationStore={validationStore}
      onSubmit$={handleSubmit}
    >
      {/* email */}
      <label class="form__input-field">
        Email: <input name="email" />
        {/* email error label */}
        {validationStore.email?.status === "invalid" && (
          <label class="form__error-label">* Invalid email address</label>
        )}
      </label>

      {/* password */}
      <label class="form__input-field">
        Password: <input name="password" type="password" />
        {/* password error label */}
        {validationStore.password?.status === "invalid" && (
          <label class="form__error-label">
            * Password must have at least 8 characters
          </label>
        )}
      </label>

      {/* submit */}
      <button class="form__input-field">Login</button>
    </Form>
  );
});

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Formite Form Tester</title>

      </head>
      <body>
        <LoginForm />
      </body>
    </>
  );
};

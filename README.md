# Formite

![formite logo](./formite-logo.png)

### A minimal and lightweight form library for Qwik

#### 🐤 As tiny as 1 KB in size (gzipped)

#### 🔀 Effortlessly works with your UI component libraries

#### 🛡️ Easy validations with RegExp, Zod and custom functions

#### 🚀 Designed with simplicity and performance in mind

## Installation

```sh
npm install formite
```

## Login form example

```tsx
import { component$, useStore} from "@builder.io/qwik";
import Form, { ValidationStore } from "formite";

export const LoginForm = component$(() => {

  // a store defining the inputs we need to validate along with their validators
  const validationStore: ValidationStore = useStore({
    email: {
      validator: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // or z.string().email()
    },
    password: {
      validator: /.{8,}/,
    },
  });

  return (
    <Form 
      validationStore={validationStore}
      onSubmit$={(formData)=>{/* send form data to server */}}>

      {/* email */}
      <div>
        Email: <input name="email" />

        {validationStore.email?.status === "invalid" && (
          <div>* Invalid email address</div>
        )}
      </div>

      {/* password */}
      <div>
        Password: <input name="password" type="password" />

        {validationStore.password?.status === "invalid" && (
          <div>* Password must have at least 8 characters</div>
        )}
      </div>

      {/* submit */}
      <button>Login</button>
    </Form>
  );
});
```

### Have an issue? [Post it here](https://github.com/kumarasinghe/formite/issues)
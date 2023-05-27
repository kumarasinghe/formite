# Formite

![formite logo](./formite-logo.png)

### A minimal and lightweight form library for Qwik

#### 🐤 As tiny as 1 KB in size (gzipped)

#### 🔀 Effortlessly works with your UI component libraries

#### 🛡️ Easy validations with RegExp, Zod and custom functions

#### 🚀 Designed with simplicity and performance in mind

### Install

```sh
npm install formite
```

### Usage

```tsx
// LoginForm.tsx

import { component$, useStore} from "@builder.io/qwik";
import Form, { ValidationStore } from "formite";

export const LoginForm = component$(() => {

  // a store with inputs to validate with their validators
  const validationStore: ValidationStore = useStore({
    email: {
      validator: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // or z.string().email()
    },
    password: {
      validator: /.{8,}/,
    },
  });

  return (
    <Form validationStore={validationStore} onSubmit$={console.log}>
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

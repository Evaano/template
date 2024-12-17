import {
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import {
  createUser,
  getUserByEmail,
  getUserPermissions,
} from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { loginSchema } from "~/zod-schemas/schema";

import classes from "~/routes-style/login.module.css";

export const meta: MetaFunction = () => [{ title: "Login" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { ...form } = Object.fromEntries(formData);

  const validatedForm = loginSchema.safeParse(form);

  if (!validatedForm.success) {
    return json(
      { errors: validatedForm.error.formErrors.fieldErrors },
      { status: 400 },
    );
  }

  const validatedData = validatedForm.data;

  const loginFormData = new FormData();
  loginFormData.append("username", validatedData.email);
  loginFormData.append("password", validatedData.password);

  const response = await fetch(`${process.env.API_URL}`, {
    method: "POST",
    body: loginFormData,
  });

  if (!response.ok) {
    return json(
      { errors: { email: "Invalid username or password", password: null } },
      { status: 400 },
    );
  }

  const data = await response.json();

  if (!data.status && data.is_aduser) {
    return json(
      { errors: { email: "Username and password incorrect", password: null } },
      { status: 400 },
    );
  } else if (!data.status && !data.is_aduser) {
    return json(
      { errors: { email: "Username and password incorrect", password: null } },
      { status: 400 },
    );
  }

  let user = await getUserByEmail(validatedData.email);

  if (!user) {
    const userFullName = JSON.parse(data.data).fullname;
    user = await createUser(validatedData.email, userFullName);
  }

  const userPermissions = await getUserPermissions(user.id);

  return createUserSession({
    redirectTo: validatedData.redirectTo,
    remember: validatedData.remember === "on",
    request,
    userId: user.id,
    userEmail: user.email,
    userPermissions,
  });
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/home";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Container size="sm" h="80vh">
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="100%"
        gap="md"
        w="100%"
      >
        <Title ta="center" className={classes.title}>
          Welcome back!
        </Title>
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{ width: "100%", maxWidth: 400 }} // Control Paper width here
        >
          <Form method="post">
            <TextInput
              ref={emailRef}
              id="email"
              name="email"
              placeholder="Your Hmh username"
              variant="filled"
              label="Username"
              type="text"
              autoComplete="email"
              error={actionData?.errors?.email}
            />
            <PasswordInput
              ref={passwordRef}
              id="password"
              name="password"
              label="Password"
              placeholder="Login Password"
              variant="filled"
              type="password"
              autoComplete="current-password"
              error={actionData?.errors?.password}
              mt="md"
            />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" name="remember" />
            </Group>
            <Button type="submit" fullWidth mt="xl">
              Log in
            </Button>
          </Form>
        </Paper>
      </Flex>
    </Container>
  );
}

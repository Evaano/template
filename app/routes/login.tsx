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
verifyLogin,
} from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";

import classes from "~/routes-style/login.module.css";
import {safeRedirect, validateEmail} from "~/utils";

export const meta: MetaFunction = () => [{ title: "Login" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
        { errors: { email: "Email is invalid", password: null } },
        { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
        { errors: { email: null, password: "Password is required" } },
        { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
        { errors: { email: null, password: "Password is too short" } },
        { status: 400 },
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
        { errors: { email: "Invalid email or password", password: null } },
        { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId: user.id,
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

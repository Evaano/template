import "@mantine/core/styles.css";
import "mantine-react-table/styles.css";
import "@mantine/dates/styles.css";

import {
  Box,
  Button,
  ColorSchemeScript,
  Container,
  createTheme,
  MantineProvider,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useMemo, useRef } from "react";

import { getUser } from "~/session.server";

const theme = createTheme({
  primaryColor: "hospital-green",
  colors: {
    "hospital-green": [
      "#15ced7",
      "#13bdc5",
      "#11acb3",
      "#109ba1",
      "#0e8a90",
      "#0c787e",
      "#0a676c",
      "#074F48",
      "#074548",
      "#053436",
    ],
  },
});

export const meta: MetaFunction = ({ error }) => {
  return [{ title: error ? "oops!" : "Inventory" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) });
};

const Document = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <title></title>
      </head>
      <body className="h-full">
        <ColorSchemeScript defaultColorScheme="auto" />
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <ModalsProvider>
            {children}
            <ScrollRestoration />
            <Notifications />
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
};

export default function App() {
  return (
    <Document>
      <Outlet />
      <Scripts />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const ErrorContent = ({
    title,
    message,
  }: {
    title?: string;
    message?: string;
  }) => (
    <Container size="md">
      <Paper p="xl" radius="lg" shadow="xl">
        <Stack align="center" gap="md">
          <Title order={1} c="red">
            {title || "Something went wrong!"}
          </Title>
          {message && <Text size="xl">{message}</Text>}
        </Stack>
      </Paper>
    </Container>
  );

  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <ErrorContent message={`${error.status} ${error.statusText}`} />
      </Document>
    );
  }

  if (error instanceof Error) {
    return (
      <Document>
        <ErrorContent message={error.message} />
      </Document>
    );
  }

  return (
    <Document>
      <ErrorContent title="App died! Contact support" />
    </Document>
  );
}

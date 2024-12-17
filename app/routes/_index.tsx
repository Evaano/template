import {
  Button,
  Container,
  Flex,
  Group,
  Image,
  useMantineColorScheme,
} from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import darkLogo from "~/assets/Primary logo-HMH-bothLANG-color-Light BG.svg";
import lightLogo from "~/assets/Primary logo-HMH-bothLANG-color-Dark BG.svg";
import { useOptionalUser } from "~/utils";
import { ToggleButton } from "~/components/toggle-button/toggle-button";

export const meta: MetaFunction = () => [{ title: "Welcome" }];

export default function Index() {
  const user = useOptionalUser();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div style={{ position: "relative", minHeight: "70vh" }}>
      <Container size={1080} my={200}>
        <Flex justify="center" align="center" direction="column">
          <Image
            src={dark ? lightLogo : darkLogo}
            h={200}
            w="auto"
            fit="contain"
          />
          <Group justify="center" px={30} mt={30}>
            {user ? (
              <Button to="/home" component={Link} size="lg">
                Logged in as {user.email}
              </Button>
            ) : (
              <div>
                <Button to="/login" component={Link} w={200} size="lg">
                  Log In
                </Button>
              </div>
            )}
          </Group>
        </Flex>
      </Container>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <ToggleButton />
      </div>
    </div>
  );
}

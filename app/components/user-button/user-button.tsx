import {
  Avatar,
  Box,
  Group,
  Menu,
  rem,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "@remix-run/react";
import { IconChevronRight, IconLogout, IconUser } from "@tabler/icons-react";
import { useState } from "react";

import classes from "~/components/user-button/user-button.module.css";

interface UserButtonProps {
  name: string;
  id: string | null;
}

export function UserButton({ name }: UserButtonProps) {
  const [isRotated, setIsRotated] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const menuWidth = isSmallScreen ? 350 : 200;

  const handleLogout = async () => {
    const response = await fetch("/logout", { method: "POST" });
    if (response.ok) {
      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }
  };

  const handleClick = () => {
    setIsRotated(!isRotated);
  };

  return (
    <Box>
      <Menu shadow="md" width={menuWidth}>
        <Menu.Target>
          <UnstyledButton className={classes.user} onClick={handleClick}>
            <Group>
              <Avatar
                src="https://i.imgur.com/LHHKM9l.png"
                radius="xl"
                style={{ opacity: 0.8 }}
              />

              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {name}
                </Text>
              </div>

              <IconChevronRight
                className={classes.chevron}
                stroke={1.5}
                style={{
                  width: rem(16),
                  height: rem(16),
                  transform: isRotated ? "rotate(90deg)" : "none",
                  transition: "transform 0.3s ease",
                }}
              />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconUser style={{ width: rem(14), height: rem(14) }} />
            }
          >
            <Link to="/user/profile" className={classes.link}>
              User Profile
            </Link>
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}

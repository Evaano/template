import {
  Box,
  Burger,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  Image,
  rem,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@remix-run/react";
import { IconChevronDown } from "@tabler/icons-react";
import { AiOutlineDropbox } from "react-icons/ai";
import { BiLowVision, BiPurchaseTag } from "react-icons/bi";
import { BsShop } from "react-icons/bs";
import { FaNotesMedical, FaUserEdit } from "react-icons/fa";
import { MdOutlineInventory, MdOutlinePendingActions } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

import darkLogo from "~/assets/Primary logo-HMH-bothLANG-color-Light BG.svg";
import lightLogo from "~/assets/Primary logo-HMH-bothLANG-color-Dark BG.svg";
import cat from "~/assets/banana-crying-cat.gif";
import { ToggleButton } from "~/components/toggle-button/toggle-button";
import { UserButton } from "~/components/user-button/user-button";
import classes from "~/components/header/header.module.css";
import { useUser } from "~/utils";
import { useState } from "react";

const storeData = [
  {
    icon: MdOutlineInventory,
    title: "Inventory Overview",
    description: "View and manage your entire inventory at a glance",
    link: "/inventory",
  },
  {
    icon: AiOutlineDropbox,
    title: "Consumption Report",
    description: "Track and analyze item usage over time",
    link: "/item/report",
  },
  {
    icon: TbTruckDelivery,
    title: "Record Delivery",
    description: "Log new deliveries and incoming inventory",
    link: "/received/entry",
  },
  {
    icon: TbTruckDelivery,
    title: "Delivery History",
    description: "Review past deliveries and shipment details",
    link: "/received/history",
  },
  {
    icon: FaNotesMedical,
    title: "Create Indent",
    description: "Submit new indent requests for required items",
    link: "/stock/",
  },
  {
    icon: BiPurchaseTag,
    title: "Create Purchase Request",
    description: "Initiate a new purchase request for supplies",
    link: "/purchase/",
  },
  {
    icon: FaNotesMedical,
    title: "Indent Status",
    description: "Check the progress of your submitted indents",
    link: "/stock/status",
  },
  {
    icon: BiPurchaseTag,
    title: "Purchase Request Status",
    description: "Monitor the status of ongoing purchase requests",
    link: "/purchase/status",
  },
  {
    icon: FaNotesMedical,
    title: "Indent History",
    description: "Access a complete record of past indents",
    link: "/stock/history",
  },
  {
    icon: BiPurchaseTag,
    title: "Purchase History",
    description: "View a comprehensive list of past purchases",
    link: "/purchase/history",
  },
];

const procurementdata = [
  {
    icon: BiPurchaseTag,
    title: "Purchase Request Status",
    description: "Monitor the status of ongoing purchase requests",
    link: "/purchase/procurement/status",
  },
  {
    icon: BiPurchaseTag,
    title: "PR Status",
    description:
      "Track the progress and approval status of items in the procurement process",
    link: "/purchase/good-status",
  },
  {
    icon: BiLowVision,
    title: "Low Stock Alerts",
    description:
      "Monitor and manage items with low stock levels to ensure timely reordering.",
    link: "/reorder",
  },
];

const managementData = [
  {
    icon: AiOutlineDropbox,
    title: "Add Item",
    description: "Easily add new items to your inventory",
    link: "/item/create",
  },
  {
    icon: AiOutlineDropbox,
    title: "Edit Item",
    description: "Modify existing item details and information",
    link: "/item/update",
  },
  {
    icon: FaUserEdit,
    title: "User Management",
    description: "Manage user accounts, roles, and permissions",
    link: "/user/manage",
  },
  {
    icon: BsShop,
    title: "Vendor Management",
    description: "Add, edit, and delete vendors",
    link: "/purchase/vendor",
  },
  {
    icon: MdOutlinePendingActions,
    title: "Activity Log",
    description: "Track all system activities and user actions",
    link: "/action-log",
  },
];

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [storeLinksOpened, { toggle: toggleStoreLinks }] = useDisclosure(false);
  const [procurementLinksOpened, { toggle: toggleProcurementLinks }] =
    useDisclosure(false);
  const [managementLinksOpened, { toggle: toggleManagementLinks }] =
    useDisclosure(false);
  const theme = useMantineTheme();
  const user = useUser();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  // New state for logo click tracking
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  // Handle logo click
  const handleLogoClick = () => {
    const newClickCount = logoClickCount + 1;
    setLogoClickCount(newClickCount);

    // Change logo after 20 clicks
    if (newClickCount === 20) {
      setCustomLogo(cat);
    }
  };

  // Determine which logo to use
  const logoSrc = customLogo || (dark ? lightLogo : darkLogo);

  const links = storeData.map((item) => (
    <Link to={item.link} className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon
            style={{ width: rem(22), height: rem(22) }}
            color={theme.colors["hospital-green"][5]}
          />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </Link>
  ));

  const procurementLinks = procurementdata.map((item) => (
    <Link to={item.link} className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon
            style={{ width: rem(22), height: rem(22) }}
            color={theme.colors["hospital-green"][5]}
          />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </Link>
  ));

  const managementLinks = managementData.map((item) => (
    <Link to={item.link} className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon
            style={{ width: rem(22), height: rem(22) }}
            color={theme.colors["hospital-green"][5]}
          />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </Link>
  ));

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Image
            src={logoSrc}
            h={70}
            w="auto"
            fit="contain"
            onClick={handleLogoClick}
          />
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link to="/home" className={classes.link}>
              Home
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <Link to="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Store
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors["hospital-green"][5]}
                    />
                  </Center>
                </Link>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Store</Text>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <Link to="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Procurement
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors["hospital-green"][5]}
                    />
                  </Center>
                </Link>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Procurement</Text>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {procurementLinks}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>

            {/*<Link to="#" className={classes.link}>*/}
            {/*  Finance*/}
            {/*</Link>*/}

            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <Link to="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Management
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors["hospital-green"][5]}
                    />
                  </Center>
                </Link>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Management</Text>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {managementLinks}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>

          <Group visibleFrom="sm" className={"inline-block"}>
            <UserButton
              name={user ? user.name : "Guest"}
              id={user ? user.id : null}
            />
            <ToggleButton />
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        hiddenFrom="sm"
        title={<ToggleButton />}
        styles={{
          header: {
            paddingLeft: "30px",
            paddingRight: "32px",
            paddingTop: "24px",
            paddingBottom: "12px",
          },
        }}
      >
        <ScrollArea h={`calc(90vh - ${rem(90)})`}>
          <Divider my="sm" />

          <Link to="/home" className={classes.link}>
            Home
          </Link>

          {/* Store Links */}
          <UnstyledButton className={classes.link} onClick={toggleStoreLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Store
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors["hospital-green"][5]}
              />
            </Center>
          </UnstyledButton>
          <Collapse mx={"lg"} in={storeLinksOpened}>
            {links}
          </Collapse>

          {/* Procurement Links */}
          <UnstyledButton
            className={classes.link}
            onClick={toggleProcurementLinks}
          >
            <Center inline>
              <Box component="span" mr={5}>
                Procurement
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors["hospital-green"][5]}
              />
            </Center>
          </UnstyledButton>
          <Collapse mx={"lg"} in={procurementLinksOpened}>
            {procurementLinks}
          </Collapse>

          {/* Management Links */}
          <UnstyledButton
            className={classes.link}
            onClick={toggleManagementLinks}
          >
            <Center inline>
              <Box component="span" mr={5}>
                Management
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors["hospital-green"][5]}
              />
            </Center>
          </UnstyledButton>
          <Collapse mx={"lg"} in={managementLinksOpened}>
            {managementLinks}
          </Collapse>

          <Divider my="sm" />
        </ScrollArea>
        <Box py="md">
          <UserButton
            name={user ? user.name : "Guest"}
            id={user ? user.id : null}
          />
        </Box>
      </Drawer>
    </Box>
  );
}

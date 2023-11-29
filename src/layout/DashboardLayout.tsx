import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Button,
  Group,
  NavLink,
  Paper,
  Skeleton,
  Text,
  Flex,
  ActionIcon,
} from "@mantine/core";
import { IconHome2, IconList, IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

const urldata = [
  { name: "Quiz", url: "/dashboard", icon: <IconList size={"18px"} /> },
];

export default function DashboardLayout({ children }: any) {
  const [opened, { toggle }] = useDisclosure();

  const router = useRouter();

  return (
    <AppShell
      header={{ height: { base: 60 } }}
      navbar={{
        width: { base: 200, md: 270 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href={"/"}>
            <Button>Home</Button>
          </Link>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {urldata.map((item, i) => {
          return (
            <Link key={i} href={`${item.url}`}>
              <Paper
                p={"xs"}
                bg={`${router.route == item.url ? "blue.3" : "gray.1"}`}
                mb={"xs"}
              >
                <Flex align={"center"} gap={"sm"}>
                  {" "}
                  <ActionIcon>{item.icon}</ActionIcon>
                  <Text>{item.name}</Text>
                </Flex>
              </Paper>
            </Link>
          );
        })}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

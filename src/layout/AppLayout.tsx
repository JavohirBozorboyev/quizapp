import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Button,
  Container,
  Text,
} from "@mantine/core";
import { ReactNode, useContext, useState } from "react";
import Link from "next/link";

import { UserContext } from "@/pages/_app";

export default function AppLayout({ children }: any) {
  const [opened, { toggle }] = useDisclosure();
  const user: any = useContext(UserContext);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Container h="100%" size={"lg"} p={0} px={"xs"}>
          <Group h="100%">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group justify="space-between" style={{ flex: 1 }}>
              <Link href={"/"}>
                <Button variant="light">Quiz App</Button>
              </Link>
              <Group ml="xl" gap={"md"} visibleFrom="sm">
                <Link href={"/dashboard"}>
                  <Text h={"100%"} fw={"500"} c={"dimmed"} py={"sm"}>
                    Dashboard
                  </Text>
                </Link>
              </Group>
              <Group ml="xl" gap={"md"} visibleFrom="sm">
                <>
                  <Link href={"/auth/signin"}>
                    <Button variant="outline" color={"gray"}>
                      Login
                    </Button>
                  </Link>
                  <Link href={"/auth/signup"}>
                    <Button>Register</Button>
                  </Link>
                </>
              </Group>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Link href={"/dashboard"}>
          <Button onClick={toggle} fullWidth variant="light" mb={"sm"}>
            Dashboard
          </Button>
        </Link>

        <Group mt={"sm"} grow>
          <Link href={"/auth/signin"}>
            <Button onClick={toggle} fullWidth variant="outline" color={"gray"}>
              Login
            </Button>
          </Link>
          <Link href={"/auth/signup"}>
            <Button onClick={toggle} fullWidth>
              Register
            </Button>
          </Link>
        </Group>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size={"lg"} p={0}>
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

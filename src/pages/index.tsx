import Head from "next/head";
import { Inter } from "next/font/google";
import AppLayout from "@/layout/AppLayout";
import { ReactElement } from "react";
import {
  Container,
  Grid,
  Paper,
  Title,
  Input,
  Button,
  Group,
} from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Container
        size={"sm"}
        p={0}
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper p={"md"} mx={"auto"} withBorder w={"100%"}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Input placeholder="Quiz Url" size="lg" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Button size="lg" fullWidth>
                Enter
              </Button>
            </Grid.Col>
          </Grid>
          <Group grow></Group>
        </Paper>
      </Container>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

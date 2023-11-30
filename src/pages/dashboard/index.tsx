/* eslint-disable react-hooks/rules-of-hooks */
import DashboardLayout from "@/layout/DashboardLayout";
import DashbaordQuizCard from "@/module/dashboard/DashbaordQuizCard";
import { TokenFetcher } from "@/utils/TokenFetcher";
import {
  Button,
  Drawer,
  Flex,
  Grid,
  Paper,
  TextInput,
  Textarea,
  Text,
  Input,
  Skeleton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { getCookie, getCookies } from "cookies-next";
import React, { ReactElement, useContext, useRef, useState } from "react";
import useSWR from "swr";
import { UserContext } from "../_app";
import { parseJson } from "@/utils/parseJson";
import { request } from "http";
import { NextResponse } from "next/server";

type Props = {};

const index = ({}: Props) => {
  // console.log(a);

  const [opened, { open, close }] = useDisclosure(false);
  const [serach, setSearch] = useDebouncedState("", 200);
  let token = getCookie("token");
  let user = parseJson(getCookie("user"));
  const { data, error, isLoading } = useSWR("/api/quiz", TokenFetcher);

  const form = useForm({
    initialValues: { title: "", des: "" },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must have at least 2 letters" : null,
      des: (value) =>
        value.length < 10 ? "Description must have at least 10 letters" : null,
    },
  });

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div>
        <Skeleton h={400} />
      </div>
    );

  const AddQuiz = () => {
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .post(
        "/api/quiz",
        {
          title: form.values.title,
          description: form.values.des,
          AuthorFullName: user ? user.FullName : null,
        },
        config
      )
      .then(function (response) {
        if (response.status == 200) {
          close();
          form.values.des = "";
          form.values.title = "";
          notifications.show({
            message: "A new quiz has been added.",
            withBorder: true,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <>
      <Paper p={"xs"} withBorder mb={"sm"}>
        <Flex justify={"space-between"}>
          <Input
            placeholder="Search"
            variant="filled"
            leftSection={<IconSearch size={"16px"} />}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <Button onClick={open}>Add Quiz</Button>
        </Flex>
      </Paper>
      <Grid>
        {data.length == 0 ? (
          <>
            <Paper py={"xl"} px={"sm"} mt={"md"} w={"100%"}>
              <Text size="xl" ta={"center"}>
                There are no quizzes
              </Text>
            </Paper>
          </>
        ) : (
          data
            .filter((item: any) =>
              item.title.toLowerCase().includes(serach.toLowerCase())
            )
            .map((item: any) => {
              return (
                <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <DashbaordQuizCard data={item} />
                </Grid.Col>
              );
            })
        )}
      </Grid>

      <Drawer position="right" opened={opened} onClose={close} title="Add Quiz">
        <form onSubmit={form.onSubmit(AddQuiz)}>
          <TextInput
            {...form.getInputProps("title")}
            withAsterisk
            label="Quiz Title"
            placeholder="Quiz Title"
          />
          <Textarea
            label="Quiz Description"
            mt={"sm"}
            placeholder="Quiz Description"
            withAsterisk
            autosize
            minRows={8}
            maxRows={12}
            {...form.getInputProps("des")}
          />
          <Button mt={"sm"} type="submit">
            Saved Quiz
          </Button>
        </form>
      </Drawer>
    </>
  );
};

index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default index;

export const getServerSideProps = ({ req, res }: any) => {
  let user = getCookie("user", { req, res });
  let token = getCookie("token", { req, res });

  if (!user || !token) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
      props: {},
    };
  }
  return { props: {} };
};

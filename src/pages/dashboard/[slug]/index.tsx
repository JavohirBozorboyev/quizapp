/* eslint-disable react-hooks/rules-of-hooks */
import DashboardLayout from "@/layout/DashboardLayout";
import QuestionOption from "@/module/dashboard/QuestionOption";
import { TokenFetcher } from "@/utils/TokenFetcher";
import { parseJson } from "@/utils/parseJson";
import {
  Accordion,
  ActionIcon,
  Button,
  Drawer,
  Flex,
  Grid,
  Modal,
  Paper,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDots, IconPlaylistAdd, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { ReactElement, useRef } from "react";
import useSWR from "swr";

type Props = {};

const index = (props: Props) => {
  const titleInp = useRef<any>("");
  const router = useRouter();

  const [openedM, { open: openM, close: closeM }] = useDisclosure(false);
  const { data, error, isLoading } = useSWR(
    `/api/quiz/${router.query.slug}`,
    TokenFetcher
  );

  const form = useForm({
    initialValues: { title: "" },
    validate: {
      title: (value) =>
        value.length < 2 ? "Questioon title must have at least 2 words" : null,
    },
  });
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  let token = getCookie("token");
  const AddQuestion = () => {
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .post(
        "/api/question",
        {
          text: form.values.title,
          quizId: data.Id,
        },
        config
      )
      .then(function (response) {
        console.log(response);

        if (response.status == 200) {
          closeM();
          notifications.show({
            message: "A new question has been added.",
            withBorder: true,
          });
          form.values.title = "";
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <Paper withBorder p={"sm"}>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="lg">{data.Title}</Text>
            <Text c="dimmed">{data.Description}</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Flex justify={"flex-end"}>
              <Button onClick={openM}>Add Question</Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </Paper>
      <QuestionOption />

      <Modal opened={openedM} onClose={closeM} title="Add Question">
        <form onSubmit={form.onSubmit(AddQuestion)}>
          <Textarea
            label="Question Title"
            placeholder="Question Title"
            minRows={4}
            maxRows={6}
            autosize
            ref={titleInp}
            {...form.getInputProps("title")}
          />
          <Button mt="md" fullWidth type="submit">
            Submit
          </Button>
        </form>
      </Modal>
    </div>
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

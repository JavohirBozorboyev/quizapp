import { TokenFetcher } from "@/utils/TokenFetcher";
import {
  Paper,
  Accordion,
  Flex,
  ActionIcon,
  Drawer,
  Textarea,
  Group,
  Radio,
  Button,
  Box,
  Text,
  Skeleton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlaylistAdd, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getCookie } from "cookies-next";
import router, { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";

type Props = {};

const QuestionOption = (props: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [correctAnswer, setCorrectAnswer] = useState("0");
  const [id, setId] = useState();
  const router = useRouter();
  let token = getCookie("token");
  const { data, error, isLoading } = useSWR(
    `/api/question?quizId=${router.query.slug}`,
    TokenFetcher
  );

  const form = useForm({
    initialValues: { a1: "", a2: "", a3: "", a4: "" },

    validate: {
      a1: (value) =>
        value.length <= 0 ? "Ansver must have at least 1 words" : null,
      a2: (value) =>
        value.length <= 0 ? "Ansver must have at least 1 words" : null,
      a3: (value) =>
        value.length <= 0 ? "Ansver must have at least 1 words" : null,
      a4: (value) =>
        value.length <= 0 ? "Ansver must have at least 1 words" : null,
    },
  });
  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <Box mt={"md"}>
        <Skeleton h={100} />
        <Skeleton h={100} my={"sm"} />
        <Skeleton h={100} />
      </Box>
    );

  const Delete = (id: number) => {
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .delete(
        `/api/question/${id}`,

        config
      )
      .then(function (response) {
        if (response.status == 204) {
          close();

          notifications.show({
            message: "Quiz has been deleted",
            withBorder: true,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const AddOption = () => {
    console.log(form.values);
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .post(
        `/api/option?questionId=${id}`,
        [
          {
            text: form.values.a1,
            isCorrect: correctAnswer == "1",
            questionId: id,
          },
          {
            text: form.values.a2,
            isCorrect: correctAnswer == "2",
            questionId: id,
          },
          {
            text: form.values.a3,
            isCorrect: correctAnswer == "3",
            questionId: id,
          },
          {
            text: form.values.a4,
            isCorrect: correctAnswer == "4",
            questionId: id,
          },
        ],
        config
      )
      .then(function (response) {
        if (response.status == 200) {
          close();
          form.values.a1 = "";
          form.values.a2 = "";
          form.values.a3 = "";
          form.values.a4 = "";
          setCorrectAnswer("");

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
    <div>
      <Paper mt={"md"}>
        <Accordion chevronPosition="left">
          {data?.map((item: any, i: number) => {
            return (
              <Accordion.Item key={i} value={`${item.Id}`}>
                <Flex align={"center"} justify={"space-between"} gap={"xs"}>
                  <Accordion.Control>{item.Text}</Accordion.Control>
                  <ActionIcon
                    size="md"
                    color="red"
                    onClick={() => Delete(item.Id)}
                  >
                    <IconTrash size="1.1rem" />
                  </ActionIcon>
                  {item.Options.length > 0 ? null : (
                    <ActionIcon
                      size="md"
                      onClick={() => {
                        open();
                        setId(item.Id);
                      }}
                      ml={"2px"}
                    >
                      <IconPlaylistAdd size="1.1rem" />
                    </ActionIcon>
                  )}
                </Flex>
                <Accordion.Panel>
                  {item.Options.map((el: any) => {
                    return (
                      <Paper
                        key={el.Id}
                        p={"xs"}
                        bg={`${el.IsCorrect ? "blue.2" : "gray.1"}`}
                        mb={"xs"}
                      >
                        <Text size="md">{el.Text}</Text>
                      </Paper>
                    );
                  })}
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Paper>

      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Add Answer"
      >
        <form onSubmit={form.onSubmit((values) => AddOption())}>
          <Textarea
            label="Answer 1"
            withAsterisk
            autosize
            minRows={3}
            maxRows={4}
            {...form.getInputProps("a1")}
          />
          <Textarea
            label="Answer 2"
            mt={"sm"}
            withAsterisk
            autosize
            minRows={3}
            maxRows={4}
            {...form.getInputProps("a2")}
          />
          <Textarea
            label="Answer 3"
            mt={"sm"}
            withAsterisk
            autosize
            minRows={3}
            maxRows={4}
            {...form.getInputProps("a3")}
          />
          <Textarea
            label="Answer 4"
            mt={"sm"}
            withAsterisk
            autosize
            minRows={3}
            maxRows={4}
            {...form.getInputProps("a4")}
          />

          <Radio.Group
            label="Correct Answer"
            mt={"md"}
            withAsterisk
            onChange={setCorrectAnswer}
          >
            <Group mt="xs">
              <Radio value="1" label="Answer 1" />
              <Radio value="2" label="Answer 2" />
              <Radio value="3" label="Answer 3" />
              <Radio value="4" label="Answer 4" />
            </Group>
          </Radio.Group>
          <Button mt={"md"} type="submit" disabled={correctAnswer === "0"}>
            Submit
          </Button>
        </form>
      </Drawer>
    </div>
  );
};

export default QuestionOption;

import { TokenFetcher } from "@/utils/TokenFetcher";
import { Paper, Accordion, Flex, ActionIcon, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlaylistAdd, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getCookie } from "cookies-next";
import router, { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

type Props = {};

const QuestionOption = (props: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  let token = getCookie("token");
  const { data, error, isLoading } = useSWR(
    `/api/question?quizId=${router.query.slug}`,
    TokenFetcher
  );
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

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
  return (
    <div>
      <Paper mt={"md"}>
        <Accordion chevronPosition="left">
          {data?.map((item: any, i: number) => {
            return (
              <Accordion.Item key={i} value={`${item.Id}`}>
                <Flex align={"center"} justify={"space-between"}>
                  <Accordion.Control>{item.Text}</Accordion.Control>
                  <ActionIcon
                    size="md"
                    color="red"
                    mr={"xs"}
                    onClick={() => Delete(item.Id)}
                  >
                    <IconTrash size="1.1rem" />
                  </ActionIcon>
                  <ActionIcon size="md" onClick={open}>
                    <IconPlaylistAdd size="1.1rem" />
                  </ActionIcon>
                </Flex>
                <Accordion.Panel>{item.description}</Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Paper>

      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Add Option"
      >
        {/* Drawer content */}
      </Drawer>
    </div>
  );
};

export default QuestionOption;

import {
  Card,
  Text,
  Button,
  Group,
  ActionIcon,
  Modal,
  CopyButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = { data: any };

const DashbaordQuizCard = ({ data }: Props) => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  let token = getCookie("token");
  const Delete = (id: number) => {
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .delete(
        `/api/quiz/${id}`,

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

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  return (
    <div>
      <Card padding="sm" withBorder>
        <Text fw={500} size="lg">
          {data.title}
        </Text>

        <Text mt="xs" c="dimmed" size="sm">
          {data.description}
        </Text>
        <Group align="center" mt={"sm"}>
          <ActionIcon variant="light" color="red" size={"lg"} onClick={open}>
            <IconTrash size={"18px"} />
          </ActionIcon>
          <CopyButton value={`${origin}/quiz/&${token}&${data.id}`}>
            {({ copied, copy }) => (
              <Button color={copied ? "teal" : "blue"} onClick={copy}>
                {copied ? "Copied url" : "Copy url"}
              </Button>
            )}
          </CopyButton>
          <Link href={`/dashboard/${data.id}`}>
            <Button fullWidth variant="light">
              Read More
            </Button>
          </Link>
        </Group>
      </Card>
      <Modal opened={opened} onClose={close} title="Delete Quiz">
        <Text fw={500} size="lg">
          {data.title}
        </Text>

        <Text mt="xs" c="dimmed" size="sm">
          {data.description}
        </Text>
        <Button fullWidth color="red" mt={"md"} onClick={() => Delete(data.id)}>
          Delete
        </Button>
      </Modal>
    </div>
  );
};

export default DashbaordQuizCard;

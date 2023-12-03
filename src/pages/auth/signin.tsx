import AppLayout from "@/layout/AppLayout";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";

export default function Signin() {
  const router = useRouter();

  const form = useForm({
    initialValues: { email: "", password: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      password: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  const Login = () => {
    axios
      .post("/api/Auth/login", {
        email: form.values.email,
        password: form.values.password,
      })
      .then(function (response) {
        console.log(response);
        if (response.status == 200) {
          setCookie("user", JSON.stringify(response.data));
          setCookie("token", `${response.data.Token}`);
          setCookie("UserId", `${response.data.UserId}`);
          setCookie("auth", `true`);
          notifications.show({
            withCloseButton: true,
            autoClose: 3000,
            message: "Tizimga kirdingiz!",
            withBorder: true,
            loading: false,
          });
          router.push("/dashboard");
          // router.reload();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center">Tizimga Kirish</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Link href={"/auth/signup"}>
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(Login)}>
          <TextInput
            mt="sm"
            label="Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            {...form.getInputProps("password")}
            placeholder="Your password"
            label="Password"
            mt={"md"}
          />
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

Signin.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

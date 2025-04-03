"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

const SignupSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address format" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  role: z.enum(["caretaker", "doctor"]),
});

export default function SignUp() {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "caretaker",
    },
  });

  const role = form.watch("role");

  async function onSubmit(data: z.infer<typeof SignupSchema>) {
    try {
      const endpoint =
        role === "caretaker"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/caretaker/signup`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/doctor/signup`;

      const response = await axios.post(endpoint, data);

      // Store user data in localStorage
      const userData = {
        id: response.data.newCaretaker.id,
        email: response.data.newCaretaker.email,
        role: role,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      toast("Account created successfully! You can now sign in.");
      router.push("/signin");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast("This email is already registered. Please use a different email or sign in.");
      } else if (error.response?.status === 400) {
        const validationErrors = error.response.data.details;
        const errorMessages = Object.entries(validationErrors)
          .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
          .join("\n");
        toast(`Validation errors:\n${errorMessages}`);
      } else {
        toast("Something went wrong. Please try again.");
      }
      console.error("Signup error:", error);
    }
  }

  const handleGoogleLogin = () => {
    // Implement Google OAuth here
    toast("Redirecting to Google login...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-teal-600">Saanjh Sahayak</h1>
        </div>

        <Card className="border-0 shadow-lg mt-6">
          <CardHeader className="text-center">
            <h2 className="text-xl font-semibold">Sign Up</h2>
            <p className="text-gray-600 mt-1">Create your account</p>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <Tabs
                  defaultValue="caretaker"
                  className="w-full"
                  onValueChange={(value) =>
                    form.setValue("role", value as "caretaker" | "doctor")
                  }
                  value={role}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="caretaker">Caretaker</TabsTrigger>
                    <TabsTrigger value="doctor">Doctor</TabsTrigger>
                  </TabsList>
                </Tabs>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Creating account..."
                    : "Create Account"}
                </Button>

                {/* <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <FaGoogle />
                  Sign in with Google
                </Button> */}
              </CardContent>

              <CardFooter className="flex flex-col">
                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-teal-600 hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

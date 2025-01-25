import configPromise from "@payload-config";
import { getPayload } from "payload";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const { email, password } = await request.json();

    const result = await payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });

    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error: Error | unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Произошла ошибка" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

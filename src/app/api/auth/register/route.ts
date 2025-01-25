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
    const { email, password, name } = await request.json();

    const result = await payload.create({
      collection: "users",
      data: {
        email,
        password,
        name,
        roles: ["user"],
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

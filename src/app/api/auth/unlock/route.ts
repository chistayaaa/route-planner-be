import configPromise from "@payload-config";
import { getPayload } from "payload";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const { email } = await request.json();

    // Находим пользователя
    const user = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (user.docs.length > 0) {
      // Сбрасываем счетчик попыток входа
      await payload.update({
        collection: "users",
        id: user.docs[0].id,
        data: {
          loginAttempts: 0,
          lockUntil: null,
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка" },
      { status: 500 }
    );
  }
}

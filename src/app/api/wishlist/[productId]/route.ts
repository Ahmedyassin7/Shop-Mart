import { getUserToken } from "@/app/Helpers/getUserToken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const token = await getUserToken();

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: { token },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET() {
  return Response.json({
    candidates: [],
    storage: "client-localStorage",
    note: "MVP bez bazy danych. Kandydaci sa zapisywani lokalnie w przegladarce po udanym wyslaniu Formspree.",
  });
}

export async function POST(request: Request) {
  const candidate = await request.json();

  return Response.json({
    candidate,
    saved: false,
    storage: "client-localStorage",
  });
}

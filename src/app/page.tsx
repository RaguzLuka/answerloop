export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          AnswerLoop for clinics
        </p>

        <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Recover missed calls and turn them into booked consultations.
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
          AnswerLoop instantly replies to missed calls, asks what treatment the client wants,
          finds a preferred time, books the consultation, and sends your clinic a clear lead summary.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#demo"
            className="rounded-full bg-black px-6 py-3 font-medium text-white"
          >
            See demo
          </a>

          <a
            href="#how"
            className="rounded-full border border-gray-300 px-6 py-3 font-medium"
          >
            How it works
          </a>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="mb-12 text-center text-4xl font-bold">
          How AnswerLoop works
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 p-6">
            <p className="mb-3 text-sm font-semibold text-gray-500">Step 1</p>
            <h3 className="mb-3 text-xl font-bold">Missed call</h3>
            <p className="text-gray-600">
              A potential client calls your clinic, but nobody answers.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 p-6">
            <p className="mb-3 text-sm font-semibold text-gray-500">Step 2</p>
            <h3 className="mb-3 text-xl font-bold">AI follow-up</h3>
            <p className="text-gray-600">
              AnswerLoop asks what treatment they want and when they prefer to come.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 p-6">
            <p className="mb-3 text-sm font-semibold text-gray-500">Step 3</p>
            <h3 className="mb-3 text-xl font-bold">Calendar booking</h3>
            <p className="text-gray-600">
              The consultation is booked automatically and your clinic gets a summary.
            </p>
          </div>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Live demo flow
            </p>

            <h2 className="mb-5 text-4xl font-bold">
              From missed call to calendar booking.
            </h2>

            <p className="mb-6 text-lg text-gray-600">
              Instead of only sending a booking link, AnswerLoop can ask the client for a preferred time,
              check availability, and create the calendar event automatically.
            </p>

            <ul className="space-y-3 text-gray-700">
              <li>✓ Detects Botox, filler, skin, dental, or other requests</li>
              <li>✓ Asks when the client wants to come</li>
              <li>✓ Checks if the time is available</li>
              <li>✓ Creates a calendar appointment</li>
              <li>✓ Sends the clinic a clear lead summary</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-5 shadow-sm">
            <div className="mb-4 text-center text-sm font-semibold text-gray-500">
              SMS conversation
            </div>

            <div className="space-y-4">
              <div className="max-w-[85%] rounded-2xl bg-white p-4 shadow-sm">
                Hi, this is Lumi Clinic. Sorry we missed your call. What treatment are you interested in?
              </div>

              <div className="ml-auto max-w-[75%] rounded-2xl bg-black p-4 text-white">
                Hi, I want Botox.
              </div>

              <div className="max-w-[85%] rounded-2xl bg-white p-4 shadow-sm">
                Of course. We can book a Botox consultation. When would you prefer to come in?
              </div>

              <div className="ml-auto max-w-[75%] rounded-2xl bg-black p-4 text-white">
                Tomorrow at 15:00.
              </div>

              <div className="max-w-[85%] rounded-2xl bg-white p-4 shadow-sm">
                Perfect. Tomorrow at 15:00 is available. Your Botox consultation is now booked.
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
              <p className="mb-2 text-sm font-semibold text-gray-500">
                Calendar updated
              </p>

              <div className="rounded-xl bg-gray-100 p-4">
                <p className="font-semibold">Botox consultation</p>
                <p className="text-sm text-gray-600">Tomorrow · 15:00–15:30</p>
                <p className="mt-2 text-sm text-gray-600">
                  Client: New client · Source: missed call recovery
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
              <p className="mb-1 text-sm font-semibold text-gray-500">
                Clinic summary
              </p>
              <p className="text-sm text-gray-700">
                New lead booked: Botox consultation, tomorrow at 15:00, new client, appointment added to calendar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
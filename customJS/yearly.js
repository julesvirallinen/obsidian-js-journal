class yearly {
  render(dv, page) {
    const { number } = dv.func;
    const { time } = customJS;
    const year = number(page.file.name);

    dv.el("h1", year);

    const events = dv
      .pages("#event or #theater-log or #vj-gig or #memorable-event")
      .where((p) => p.date && p.date.year === year);

    const jobsStarted = dv
      .pages("#job-history")
      .where((p) => p.started.year === year)
      .map((p) => ({ ...p, date: p.started }));

    const jobsEnded = dv
      .pages("#job-history")
      .where((p) => p.ended && p.ended.year === year)
      .map((p) => ({ ...p, date: p.ended }));

    const apartments = dv
      .pages("#apartment-history")
      .where((p) => p.movedIn.year === year)
      .map((p) => ({ ...p, date: p.movedIn }));

    const allEvents = dv.array([
      ...jobsStarted,
      ...jobsEnded,
      ...events,
      ...apartments,
    ]);

    const sortedEvents = allEvents.sort(time.getEventDate(dv));

    for (const event of sortedEvents) {
      let tags = [...(event.tags ?? [])];
      if (tags.includes("festival")) {
        dv.el(
          "code",
          `${event.date.toFormat("MMMM dd")} - ${event.endDate.toFormat(
            "MMMM dd"
          )}`
        );
        dv.el(
          "p",
          `>[!tip] FEST: [[${event.file.link.path} | ${event.file.name}]]`
        );
      }
      if (tags.includes("travel-log")) {
        dv.el(
          "code",
          `${event.date.toFormat("MMMM dd")} - ${event.endDate.toFormat(
            "MMMM dd"
          )}`
        );
        dv.el(
          "p",
          `>[!info]  [[${event.file.link.path} | ${
            event.name ?? event.file.name
          }]]`
        );
      }
      if (tags.includes("theater-log")) {
        this.printDate(dv, event.date);
        dv.el(
          "p",
          `>[!quote] [[${event.file.link.path} | ${event.file.name}]]`
        );
      }
      if (tags.includes("vj-gig")) {
        this.printDate(dv, event.date);
        dv.el(
          "p",
          `>[!error] [[${event.file.link.path} | ${event.file.name}]]`
        );
      }
      if (tags.includes("memorable-event")) {
        this.printDate(dv, event.date);
        dv.el(
          "p",
          `>[!tldr] [[${event.file.link.path} | ${
            event.name ?? event.file.name
          }]]`
        );
      }
      if (tags.includes("life-event")) {
        this.printDate(dv, event.date);
        dv.el(
          "p",
          `>[!attention] [[${event.file.link.path} | ${
            event.name ?? event.file.name
          }]]`
        );
      }
      if (tags.includes("job-history")) {
        this.printDate(dv, event.date);
        if (event.date === event.started) {
          dv.el(
            "p",
            `>[!info] Started at [[${event.file.link.path} | ${event.file.name}]]`
          );
        }
        if (event.date === event.ended) {
          dv.el(
            "p",
            `>[!info] Ended at [[${event.file.link.path} | ${event.file.name}]]`
          );
        }
      }
      if (tags.includes("apartment-history")) {
        this.printDate(dv, event.date);
        dv.el(
          "p",
          `>[!info] Moved to [[${event.file.link.path} | ${event.name}]]`
        );
      }
    }
  }
  printDate(dv, date) {
    dv.el("code", `${date.toFormat("MMMM dd")}`);
  }
}

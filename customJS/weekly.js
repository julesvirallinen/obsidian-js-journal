class weekly {
  render(dv, weeklyPage) {
    this.renderDailyPages(dv, weeklyPage);
    this.renderEvents(dv, weeklyPage);
    this.printMemorableEvents(dv, weeklyPage);
  }

  renderEvents(dv, weeklyPage) {
    const { events } = customJS;
    const interval = this.getInterval(dv, weeklyPage);
    dv.el("h2", `Events: `);
    const weekEvents = events.getEventsBetweenDates(dv, interval.s, interval.e);

    events.printEventsByDay(dv, weekEvents);
  }

  printMemorableEvents(dv, weeklyPage) {
    const { events } = customJS;
    const interval = this.getInterval(dv, weeklyPage);

    const eventsToday = events.getMemoriesBetweenDates(
      dv,
      interval.s,
      interval.e
    );
    if (eventsToday.length == 0) return;
    dv.span("---");
    dv.el("h5", "On this week:");

    events.printEventsByDay(
      dv,
      eventsToday.map((event) => ({
        ...event,
        date: dv.date(event.realDate).toFormat("yyyy-MM-dd"),
      })),
      "yyyy"
    );
  }

  renderDailyPages(dv, weeklyPage) {
    dv.el("h2", "Daily pages");
    const interval = this.getInterval(dv, weeklyPage);

    const weekAsNumber = +interval.s.toFormat("WW");
    const year = interval.s.toFormat("yyyy");

    dv.el(
      "p",
      `← [[${year}-W${weekAsNumber - 1}]] | [[${year}-W${weekAsNumber + 1}]] →`
    );

    const dailyPages = dv
      .pages("#daily")
      .where(
        (p) =>
          p.file.name !== "daily" &&
          dv.date(p.file.name) >= interval.s &&
          dv.date(p.file.name) < interval.e
      )
      .sort((p) => p.file.name);

    dv.el(
      "p",
      dailyPages
        .map(
          (p) =>
            `[[${p.file.link.path}|${dv.date(p.file.name).toFormat("ccc")}]]`
        )
        .join(", ")
    );

    this.renderInitiativeLog(dv, dailyPages);
  }
  renderInitiativeLog(dv, dailyPages) {
    let getEmoji = (value) => {
      if (value === null) {
        return "🔴";
      }
      if (Array.isArray(value)) {
        return "🟢";
      } else return "⚪";
    };
    dv.el(
      "span",
      dailyPages.map((p) => getEmoji(p.initiativesCompleted)).join("  ")
    );
  }
  getInterval(dv, weeklyPage) {
    const { time } = customJS;
    const weekname = weeklyPage.file.name;
    const interval = time.parseWeek(dv, weekname);
    return interval;
  }
}

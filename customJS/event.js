class events {
  getEvents(dv) {
    const { time } = customJS;

    const events = dv
      .pages('-"0 Meta/00.03_templates"')
      .where(
        (p) =>
          (p.date && p.fileClass?.includes("Event")) ||
          p.tags?.includes("event")
      )
      .sort((p) => {
        try {
          return time.parseLinkOrDate(dv, p.date);
        } catch (error) {
          console.log("sos", p);
        }
      });

    return dv.array([
      ...events,
      ...this.getBirthdays(dv),
      ...this.getYearlyEvents(dv),
    ]);
  }
  getEventsBetweenDates(dv, startDate, endDate) {
    const { time } = customJS;
    return this.getEvents(dv).where((p) => {
      const dt = time.parseLinkOrDate(dv, p.date);

      return dt >= startDate && (!!endDate ? dt <= endDate : true);
    });
  }
  getMemoriesForDate(dv, date) {
    const memories = dv
      .pages(`#memorable-event OR #life-event`)
      .where((p) => !p.hide)
      .map(this.yearlyEventToEvent(dv, "🔁"))
      .filter((p) => dv.date(p.date).toFormat("yyyy-MM-dd") == date);

    return memories;
  }

  getMemoriesBetweenDates(dv, startDate, endDate) {
    const { time } = customJS;

    const memories = dv
      .pages(`#memorable-event OR #life-event OR #vj-gig OR #travel-log`)
      .where((p) => !p.hide)
      // filter dates this year:
      .filter((p) => {
        const dt = dv.date(p.date);
        return +dt.toFormat("yyyy") !== time.now(dv).year;
      })
      .map(this.yearlyEventToEvent(dv, "🔁"))
      .filter((p) => {
        const dt = dv.date(p.date);
        return dt >= startDate && (!!endDate ? dt <= endDate : true);
      });

    return memories;
  }

  printEvent(dv, event) {
    const location = event.location ? `_@${event.location}_` : "";
    const linkText = `${event.startTime ?? "??"}: [[${event.file.link.path} | ${
      event.name || event.file.name
    }]]${location && ` ${location}`}`;
    if (event.skipped) {
      dv.paragraph(`~~${linkText}~~`);
    } else {
      dv.paragraph(linkText);
    }
  }
  printEvents(dv, events) {
    const sortedEvents = events.sort((e) => e.startTime);
    for (const event of sortedEvents) {
      this.printEvent(dv, event);
    }
  }
  printEventsByDay(dv, events, format = "DDDD") {
    const eventsByDate = events.groupBy((p) =>
      dv.date(p.date).toFormat(format)
    );

    for (const { key, rows } of eventsByDate) {
      dv.paragraph(`#### ${key}`);
      this.printEvents(dv, rows);
    }
  }
  toCurrentYearDay(dv, date) {
    const { time } = customJS;

    return dv.luxon.DateTime.fromObject({
      month: date.month,
      day: date.day,
      year: time.now(dv).year,
    });
  }
  yearlyEventToEvent(dv, startTime) {
    return (eventPage) => ({
      ...eventPage,
      realDate: eventPage.date,
      date: this.toCurrentYearDay(
        dv,
        dv.date(eventPage.date ?? eventPage.birthday)
      ),
      startTime: startTime,
    });
  }
  // BIRTHDAYS
  getBirthdays(dv) {
    const { C } = customJS;

    const birthdays = dv
      .pages(`"${C.paths.people}"`)
      .where((p) => p.birthday && !p.hide)
      .map(this.yearlyEventToEvent(dv, "🎂"));

    return birthdays;
  }
  getYearlyEvents(dv) {
    const birthdays = dv
      .pages(`#yearly-event`)
      .where((p) => !p.hide)
      .map(this.yearlyEventToEvent(dv, "🔄"));

    return birthdays;
  }
}

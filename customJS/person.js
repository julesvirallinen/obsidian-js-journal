class person {
  renderPersonInfo(dv, personPage) {
    const { actions } = customJS;
    dv.el("h1", personPage.name);
    dv.el("span", "[[321.0 People]]");
    dv.el("h2", "Info");

    const { days, festivals, metPage, lastSeen, events, trips, lifeEvents } =
      this.getWithPages(dv, personPage);
    dv.el("p", `Seen ${days.length} times`);
    this.renderLastSeenInfo(dv, lastSeen);

    this.renderMetInfo(dv, personPage, metPage);

    this.renderGiftsSection(dv, personPage);

    actions.addGiftGiven(dv);
    actions.addGiftReceived(dv);

    dv.el("h2", "Events");
    dv.el("p", `Festivals: ${festivals.map((f) => f.file.link).join(", ")}`);
    trips.length &&
      dv.el("p", `Trips: ${trips.map((f) => f.file.link).join(", ")}`);
    lifeEvents.length &&
      dv.el(
        "p",
        `Life events: ${lifeEvents.map((f) => f.file.link).join(", ")}`
      );

    dv.span(
      `>[!info]- All events\n${events.map((e) => e.file.link).join(",\n")}`
    );
  }

  renderGiftsSection(dv, personPage) {
    const { gift } = customJS;

    const giftsReceived = gift.findGiftsReceived(dv, personPage);
    const giftsGiven = gift.findGiftsGiven(dv, personPage);

    dv.span("___");

    if (giftsGiven.length) {
      dv.el("h3", "Gifts given");

      dv.table(
        ["Date", "Gift"],
        giftsGiven.map((p) => [
          dv.func.date(p.date),
          `[[${p.file.link.path}|${p.name || p.file.name}]]`,
        ])
      );
      dv.span("___");
    }

    if (giftsReceived.length) {
      dv.el("h3", "Gifts received");
      dv.table(
        ["Date", "Gift"],
        giftsReceived.map((p) => [dv.func.date(p.date), p.file.link])
      );
    }
  }
  // todo: move to event funcs
  getEventDate = (dv) => (p) => {
    const { time } = customJS;
    return time.getEventDate(dv)(p);
  };

  renderLastSeenInfo(dv, lastSeenPage) {
    if (!lastSeenPage) {
      dv.el("p", "No last seen info");
      return;
    }
    const { time } = customJS;
    const formattedDuration = time.formatTimeSince(
      dv,
      this.getEventDate(dv)(lastSeenPage)
    );

    dv.el(
      "p",
      // TODO: move to event func
      `Last seen ${formattedDuration} ago ([[${lastSeenPage.file.link.path}|${
        lastSeenPage.name ?? lastSeenPage.file.name
      }]])`
    );
  }
  getWithPages(dv, personPage) {
    const { time } = customJS;
    const { contains } = dv.func;
    // TODO: optimize
    const pages = dv
      .pages()
      .where(
        (p) =>
          dv.func.contains(p.saw, personPage.file.link) ||
          dv.func.contains(p.with, personPage.file.link) ||
          dv.func.contains(p.met, personPage.file.link)
      );

    const dayObject = pages.array().reduce((acc, p) => {
      const date = this.getEventDate(dv)(p);
      if (!date) {
        return acc;
      }

      return { [date.toFormat("yyyy-MM-dd")]: p, ...acc };
    }, {});

    const days = Object.values(dayObject);

    const sortedEvents = pages.sort(this.getEventDate(dv));
    const pastEvents = sortedEvents.where(
      (p) => this.getEventDate(dv)(p) < time.now(dv)
    );
    const festivals = sortedEvents.filter((p) =>
      (p.tags ?? []).includes("festival")
    );
    const lifeEvents = sortedEvents.filter((p) =>
      contains(p.tags, "life-event")
    );

    const trips = sortedEvents.filter((p) => contains(p.tags, "travel-log"));
    const met = pages.find((p) => contains(p.met, personPage.file.link));

    return {
      days: days.map((day) => time.toDef(day)),
      festivals,
      metPage: met,
      lastSeen: pastEvents.last(),
      events: sortedEvents.array(),
      trips,
      lifeEvents,
    };
  }
  renderMetInfo(dv, personPage, metPage) {
    const { time } = customJS;
    let met = dv.date(personPage.met);
    let link;
    if (metPage?.date) {
      met = dv.date(metPage.date);
      link = metPage.file.link;
    }

    if (link) {
      dv.el("p", `Met ${time.formatTimeSince(dv, met)} ago at ${link}`);
      return;
    }

    if (!met) {
      return;
    }

    dv.el("p", `Met ${time.formatTimeSince(dv, met)} ago`);
  }

  // saw = saw at event or day
  getSeenCount(dv, personPage) {
    return dv
      .pages()
      .where((p) => dv.func.contains(p.saw, personPage.file.link)).length;
  }
  // with = spent time with
  getWithCount(dv, personPage) {
    return dv
      .pages()
      .where((p) => dv.func.contains(p.with, personPage.file.link)).length;
  }
}

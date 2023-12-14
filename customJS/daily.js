class daily {
  renderDaily(dv, page) {
    this.printEvents(dv, page);
    dv.span("---");
    this.renderInitiative(dv, page);
    dv.span("---");
    this.printTasks(dv, page);
    dv.span("---");
    this.printMemorableEvents(dv, page);
  }
  printEvents(dv, page) {
    const { events, actions } = customJS;

    const eventsToday = events.getEventsBetweenDates(
      dv,
      dv.date(page.file.name),
      dv.date(page.file.name)
    );

    events.printEvents(dv, eventsToday);
    actions.addEvent(dv);
  }
  printMemorableEvents(dv, page) {
    const { events } = customJS;

    const eventsToday = events.getMemoriesForDate(dv, page.file.name);
    if (eventsToday.length == 0) return;
    dv.el("h5", "On this day:");

    events.printEvents(dv, eventsToday);
  }
  printTasks(dv, page) {
    const { time } = customJS;
    const isToday =
      time.formatDateToDefault(dv.date(page.file.name)) == time.getToday(dv);

    const due = dv
      .pages()
      .where((p) => !p.skip)
      .file.tasks.where((task) =>
        !task.completed && !task.completion && task.due && isToday
          ? dv.date(task.due) < dv.date(page.file.name)
          : dv.date(task.due) == dv.date(page.file.name)
      );
    if (due.length > 0) {
      dv.el("h5", "Tasks due");

      dv.taskList(due, false);
    } else {
      dv.el("p", "✅ all tasks done");
    }

    const completedTasks = dv
      .pages()
      .file.tasks.where(
        (task) =>
          task.completion &&
          time.formatDateToDefault(task.completion) == page.file.name
      );
    if (completedTasks.length > 0) {
      dv.el("h5", "Completed tasks");

      dv.taskList(completedTasks, false);
    } else {
    }
  }
  renderInitiative(dv, page) {
    const week = dv.date(page.file.name).toFormat("yyyy-'W'WW");
    const weekPage = dv.page(week);
    const initiatives = weekPage?.initiatives ?? [];
    if (!initiatives.length === 0) return;

    const completedInitiatives = page.initiativesCompleted ?? [];
    const isInitiativeCompleted = (initiative) =>
      completedInitiatives.some((i) => i.path == initiative?.file?.path);

    for (const initiative of initiatives) {
      const initiativePage = dv.page(initiative?.path);
      const initiativeDoneToday =
        page.completedInitiative || isInitiativeCompleted(initiativePage);
      const initiativeEmoji = initiativeDoneToday ? "✅" : "❌";
      if (initiativePage) {
        dv.el(
          "p",
          `initiative: ${initiativePage.file.link} ${initiativeEmoji}`
        );
      }
    }
  }
}

class clothing {
  renderClothingInfo(dv, clothing) {
    const wornTimes = this.getWornTimes(dv, clothing);

    dv.el("p", `Worn ${wornTimes.length} times`);
    this.renderLastWornInfo(dv, wornTimes);

    this.renderTimeOwned(dv, clothing.received);
  }

  renderLastWornInfo(dv, wornTimes) {
    const { time } = customJS;
    const sortedWornTimes = wornTimes.sort(time.getEventDate(dv));
    const latestTime = sortedWornTimes.last();

    if (!latestTime) {
      return;
    }
    const formattedDuration = time.formatTimeSince(
      dv,
      time.getEventDate(dv)(latestTime)
    );
    dv.el(
      "p",
      `Last worn [[${latestTime.file.link.path}|${
        formattedDuration || "today"
      }]] ago`
    );
  }
  getWornTimes(dv, clothing) {
    return dv
      .pages("#event OR #daily")
      .where((p) => dv.func.contains(p.wore, clothing.file.link));
  }
  renderTimeOwned(dv, date) {
    const { time } = customJS;
    const Duration = time.getDur(dv);
    const DateTime = time.getDateTime(dv);

    const timeSinceLastWorn = Duration.fromMillis(
      DateTime.now() - dv.date(date)
    );

    const formattedDuration = time.formatDuration(timeSinceLastWorn);

    dv.el("span", `Owned for ${formattedDuration}`);
  }
}

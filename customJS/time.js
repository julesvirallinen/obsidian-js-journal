class time {
  NEVER = "never";
  DEBUG = false;
  formatTimeSince(dv, date) {
    const Duration = this.getDur(dv);
    const DateTime = this.getDateTime(dv);

    const duration = Duration.fromMillis(DateTime.now() - date);
    const formattedDuration = this.formatDuration(duration);
    return formattedDuration;
  }
  formatDuration(duration) {
    return duration
      .rescale()
      .set({ milliseconds: 0, seconds: 0, hours: 0, minutes: 0 })
      .rescale()
      .toHuman();
  }

  getDur(dv) {
    return dv.luxon.Duration;
  }
  getDateTime(dv) {
    return dv.luxon.DateTime;
  }
  now(dv) {
    return this.getDateTime(dv).now();
  }
  parseWeek(dv, week) {
    const startTime = this.getDateTime(dv).fromISO(week);
    const oneWeek = this.getDur(dv).fromObject({ weeks: 1 });
    return dv.luxon.Interval.after(startTime, oneWeek);
  }

  formatDateToDefault(date) {
    try {
      return date.toFormat("yyyy-MM-dd");
    } catch (error) {}
  }
  toDef(date) {
    return this.formatDateToDefault(date);
  }
  getToday(dv) {
    return this.formatDateToDefault(this.getDateTime(dv).now());
  }
  safeParseDate(dv, date) {
    try {
      return dv.date(date);
    } catch (error) {
      console.log(`could not parse ${date}`);
      return null;
    }
  }
  parseLinkOrDate(dv, date) {
    try {
      if (date?.isLuxonDateTime) {
        this.DEBUG && console.log("is luxon", date);
        return date;
      }
      // isstring
      if (typeof date === "string") {
        DEBUG && console.log("parsing date from path", dv.date(date?.path));
      }
      if (date?.path) {
        const dailyPage = dv.page(date.path);
        if (!dailyPage) {
          DEBUG && console.log("parsing date from path", dv.date(date?.path));
          return dv.date(date?.path);
        }
        DEBUG && console.log("parsing date from daily page", dailyPage);
        return dv.date(dailyPage.file.name);
      }
      this.DEBUG && console.log("parsing date page date", dv.date(date));
      return dv.date(date);
    } catch (error) {
      console.log(`could not parse ${date}`);

      throw new Error(`could not parse ${date}`);
    }
  }
  getEventDate = (dv) => (p) => {
    const { time } = customJS;
    const { contains } = dv.func;

    if (p.date) {
      return time.parseLinkOrDate(dv, p.date);
    }

    if (contains(p.tags, "daily")) {
      return dv.date(p.file.name);
    }
    if (contains(p.fileClass, "Event")) {
      return time.parseLinkOrDate(dv, p.date);
    }
  };
}

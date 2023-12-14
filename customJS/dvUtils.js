class dvUtils {
  getFileClass(fileClass) {
    return (page) => {
      const fc = page.fileClass;
      if (Array.isArray(fc)) {
        return fc.includes(fileClass);
      }
      return fc === fileClass;
    };
  }
  getImages(file) {
    const outlinks = file.file.outlinks.array();
    const imageEndings = [".png", ".jpg", ".jpeg", ".gif"];
    const endsWithImage = (path) =>
      imageEndings.some((ending) => path.endsWith(ending));

    return outlinks.filter((file) => endsWithImage(file.path));
  }
  embedImage(dvLink, size) {
    if (size) {
      return `![[${dvLink.path}|${size}]]`;
    }
    return `![[${dvLink.path}]]`;
  }
  getEvents(dv) {
    return dv.pages().where(this.getFileClass("Event"))
  }
}

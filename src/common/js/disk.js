
export default class Disk {
  constructor({id, name, image}) {
    this.id = id;
    this.name = name;
    this.image = image;
  }
}

export function createDisk(disk) {
  return new Disk({
    id: disk.id,
    name: disk.name,
    image: disk.coverImgUrl,
  })
}



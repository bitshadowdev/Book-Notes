
// Make a template for the fields

export function createCollection(name: string): void {
  const collection = [{}]
  
  localStorage.setItem(name, JSON.stringify(collection))
  
}

export function getCollection<Type>(name: string): Type {
  const item = localStorage.getItem(name);
  if (item) {
    return JSON.parse(item) as Type;
  }
  return {} as Type;
}

export function existCollection(name: string) {
  return localStorage.getItem(name) ? true : false
}

export function appendItemToCollection<Type>(name: string, item: Type): void {
  // Get rid of the {} elements 
  const collection = getCollection<Type[]>(name) as Type[]

  collection.push(item)
  localStorage.setItem(name, JSON.stringify(collection))
}

export function getItemFromCollection<Type>(name: string, index: number): Type {
  const collection = getCollection<Type[]>(name)
  return collection[index]
}

export function updateItemInCollection<Type>(name: string, index: number, item: Type): void {
  const collection = getCollection<Type[]>(name)
  collection[index] = item
  localStorage.setItem(name, JSON.stringify(collection))
}

export function deleteItemInCollection<Type>(name: string, index: number): void {
  const collection = getCollection<Type[]>(name)
  collection.splice(index, 1)
  localStorage.setItem(name, JSON.stringify(collection))
}

export const clearCollection = ( name: string ) => {
  localStorage.removeItem(name)
}

export const clearAllCollections = () => {
  localStorage.clear()
}

export const imageToBase64 = (image: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
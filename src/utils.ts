const epochToDateString = (epoch: number) => {
  const unixMilliseconds = epoch * 1000
  return new Date(unixMilliseconds).toLocaleDateString()
}

export { epochToDateString }

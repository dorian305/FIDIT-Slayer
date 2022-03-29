export function randomNumber(lowerBound = null, upperBound = null) {
  // Bounds not defined (Standard JS random number)
  if (!lowerBound && !upperBound){
    return Math.random()
  }
  // Bounds have been provided (Inclusive, [a, b])
  else {
    lowerBound = Math.ceil(lowerBound);
    upperBound = Math.floor(upperBound);
    return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
  }
}
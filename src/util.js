export function isPowerOfTwo(num) {
  while (((num % 2) == 0) && num > 1) {
    num /= 2;
  }
  return (num == 1);
}

export function error(message){
  throw new Error("Meyda: "+message);
}

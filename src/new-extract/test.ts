function a(arg?: string) {
  return null;
}

function b(arg?: string) {
  return a(arg);
}

b();

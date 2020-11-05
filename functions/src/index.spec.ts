const useSpy = jest.fn();
const corsSpy = jest.fn();
const routesSpy = jest.fn();

jest.mock('express', () => {
  return () => ({
    use: useSpy 
  });
});

jest.mock('cors', () => {
  return corsSpy;
});

jest.doMock('./users/routes-config', () => ({
    routesConfig: routesSpy
  })
);

describe('index', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize an express server', () => {
    require('./index');
    expect(useSpy).toHaveBeenCalledWith(corsSpy());
    expect(routesSpy).toHaveBeenCalled();
  });

});
describe("Lists suite", function() {
  it("fold function", function() {
    var list = S.data.Lists.list;
    var empty = S.data.Lists.empty;
    var l = list(1, 2, 3, 4);
    var n = l.fold(function(a,b){ return a+b; }, 0);

    expect(n).toBe(10);
  });

  it("foldr function", function() {
    var list = S.data.Lists.list;
    var empty = S.data.Lists.empty;
    var l = list(1, 2, 3, 4);
    var n = l.foldr(function(a,b){ return a+b; }, 0);

    expect(n).toBe(10);
  });

  it("map function", function() {
    var list = S.data.Lists.list;
    var empty = S.data.Lists.empty;
    var l = list(1, 2, 3, 4);
    var k = l.map(function(n){ return n*2; }).fold(function(a,b){ return a+b; }, 0);

    expect(k).toBe(20);
  });

  it("filter function", function() {
    var list = S.data.Lists.list;
    var empty = S.data.Lists.empty;
    var l = list(1, 2, 3, 4);
    var k = l
      .map(function(n){ return n*n; })
      .filter(function(n){ return n > 10; })
      .fold(function(a,b){ return a+b; }, 0);

    expect(k).toBe(16);
  });

  it("dropWhile function", function() {
    var list = S.data.Lists.list;
    var empty = S.data.Lists.empty;
    var l = list(1, 2, 3, 4);
    var ll = l.dropWhile(function(i){ return i != 2; });

    expect(l.head()).toBe(4);
    expect(ll.head()).toBe(2);
    expect(ll.tail().head()).toBe(1);
  });

  it("drop function", function() {
    var list = S.data.Lists.list;
    var empty = S.data.Lists.empty;
    var l = list(1, 2, 3, 4);
    var ll = l.drop(2);
    expect(l.head()).toBe(4);
    expect(ll.head()).toBe(2);
    expect(ll.tail().head()).toBe(1);
    expect(ll.drop(11).isEmpty()).toBe(true);
  });


});

describe("Streams suite", function() {

  it("Numbers inc function", function() {
    var numbers = new S.data.Stream.Numbers(1);
    expect(numbers.tail().head()).toBe(2);
    expect(numbers.tail().tail().head()).toBe(3);
    expect(numbers.tail().tail().tail().head()).toBe(4);
  });

  it("filter function", function() {
    var numbers = new S.data.Stream.Numbers(1);
    var l = numbers.filter(function(n){ return n > 10; });
    expect(l.head()).toBe(10);
  });

    it("map function", function() {
    var numbers = new S.data.Stream.Numbers(1);

    expect(l.head()).toBe(10);
  })

  it("dropWhile function", function() {
    var numbers = new S.data.Stream.Numbers(1);
    var ll = numbers.dropWhile(function(i){ return i < 50; });
    expect(ll.head()).toBe(50);
    expect(ll.tail().head()).toBe(51);
   });

  it("drop function", function() {
    var numbers = new S.data.Stream.Numbers(1);
    var ll = numbers.drop(2);
    expect(ll.head()).toBe(3);
    expect(numbers.drop(100).head()).toBe(101);
  });


})

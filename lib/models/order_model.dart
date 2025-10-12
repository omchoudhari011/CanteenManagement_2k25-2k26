class OrderModel {
  final String id;
  final String userId;
  final List<String> items;
  final double total;
  final String status;

  OrderModel({required this.id, required this.userId, required this.items, required this.total, required this.status});
}

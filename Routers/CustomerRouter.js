const { Router } = require("express");
const router = Router();
const { Customer, validateCustomer } = require("../Models/Customer");

router.get("/", (req, res) => {
  Customer.find()
    .then((customers) => {
      if (!customers || customers.length === 0)
        return res.status(404).send("No customers found");
      res.status(200).json(customers);
    })
    .catch((err) => {
      console.error("Error fetching customers:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const customerById = Customer.findById(id);
  customerById
    .then((customer) => {
      if (!customer) return res.status(404).send("Customer not found");
      res.status(200).json(customer);
    })
    .catch((err) => {
      console.error("Error fetching customer by ID:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/", (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newCustomer = new Customer(req.body);
  newCustomer
    .save()
    .then((customer) => {
      res.status(201).json(customer);
    })
    .catch((err) => {
      console.error("Error saving customer:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.put("/:id", (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { id } = req.params;
  const updatedCustomer = new Customer(req.body);
  updatedCustomer._id = id; // Ensure the ID is set for the update

  Customer.findByIdAndUpdate(id, updatedCustomer, { new: true })
    .then((customer) => {
      if (!customer) return res.status(404).send("Customer not found");
      res.status(200).json(customer);
    })
    .catch((err) => {
      console.error("Error updating customer:", err);
      res.status(500).send("Internal Server Error");
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Customer.findByIdAndDelete(id)
    .then((deletedCustomer) => {
      if (!deletedCustomer) return res.status(404).send("Customer not found");
      res.status(200).json({
        message: "Customer deleted successfully",
        customer: deletedCustomer,
      });
    })
    .catch((err) => {
      console.error("Error deleting customer:", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;

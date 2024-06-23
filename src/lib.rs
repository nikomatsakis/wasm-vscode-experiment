// Use a procedural macro to generate bindings for the world we specified in
// `calculator.wit`
wit_bindgen::generate!({
    // the name of the world in the `*.wit` input file
    world: "calculator",
});

struct Calculator;

impl Guest for Calculator {
    fn calc(op: Operation) -> u32 {
        match op {
            Operation::Add(operands) => operands.left + operands.right,
            Operation::Sub(operands) => operands.left - operands.right,
            Operation::Mul(operands) => operands.left * operands.right,
            Operation::Div(operands) => operands.left / operands.right,
        }
    }
}

// Export the Calculator to the extension code.
export!(Calculator);

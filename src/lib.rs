use std::sync::{Arc, Mutex};
use std::future::Future;
use crate::exports::vscode::example::types::GuestWithOperandValue;
use crate::vscode::example::types::Operand;

// Use a procedural macro to generate bindings for the world we specified in
// `calculator.wit`
wit_bindgen::generate!({
    // the name of the world in the `*.wit` input file
    world: "calculator",
});

struct Calculator;

async fn calculate(operation: Operation) -> u32 {
    match operation {
        Operation::Add(operands) => {
            let left = resolve_operand(operands.left).await;
            let right = resolve_operand(operands.right).await;
            left + right
        }
        Operation::Sub(operands) => {
            let left = resolve_operand(operands.left).await;
            let right = resolve_operand(operands.right).await;
            left - right
        }
        Operation::Mul(operands) => {
            let left = resolve_operand(operands.left).await;
            let right = resolve_operand(operands.right).await;
            left * right
        }
        Operation::Div(operands) => {
            let left = resolve_operand(operands.left).await;
            let right = resolve_operand(operands.right).await;
            left / right
        }
    }
}

fn resolve_operand(operand: Operand) -> impl Future<Output = u32> {
    let future = ResolveOperandFuture {
        data: Arc::new(Mutex::new(None)),
    };
    match operand {
        Operand::Integer(v) => {
            *future.data.lock().unwrap() = Some(v);
        }
        Operand::Variable(name) => {
            resolve_variable(&name, WithOperandValue::new(future.clone()));
        }
    }
    future
}

#[derive(Clone)]
struct ResolveOperandFuture {
    data: Arc<Mutex<Option<u32>>>,
}

impl GuestWithOperandValue for ResolveOperandFuture {
    fn value(&self, value: u32) {
        let data = self.data.lock().unwrap();
        *data = Some(value);
    }
}

impl std::future::Future for ResolveOperandFuture {
    type Output = u32;

    fn poll(self: std::pin::Pin<&mut Self>, _cx: &mut std::task::Context<'_>) -> std::task::Poll<Self::Output> {
        match *self.data.lock().unwrap() {
            Some(v) => std::task::Poll::Ready(v),
            None => std::task::Poll::Pending,
        }
    }
}

// Export the Calculator to the extension code.
export!(Calculator);

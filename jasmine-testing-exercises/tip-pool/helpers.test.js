describe("Helper test", function() {
  it('should sum all the payments of a given type', function () {
    billAmtInput.value = 100;
    tipAmtInput.value = 20;
    submitPaymentInfo();

    expect(sumPaymentTotal('tipAmt')).toEqual(20);
    expect(sumPaymentTotal('billAmt')).toEqual(100);
    expect(sumPaymentTotal('tipPercent')).toEqual(20);
	
    billAmtInput.value = 200;
    tipAmtInput.value = 40;
    submitPaymentInfo();

    expect(sumPaymentTotal('tipAmt')).toEqual(60);
    expect(sumPaymentTotal('billAmt')).toEqual(300);
    expect(sumPaymentTotal('tipPercent')).toEqual(40);

    for (let i = 0; i < 2; i++) {
      delete allPayments['payment' + paymentId];
      document.querySelector('#payment' + paymentId).remove();
      --paymentId;
    }

    updateSummary();
  });

  it('should calculate the tip percent from the bill and tip amounts', function () {
    expect(calculateTipPercent(100, 20)).toEqual(20);
    expect(calculateTipPercent(50, 15)).toEqual(30);
    expect(calculateTipPercent(1234, 0)).toEqual(0);
  });

  it('should append a td element to a given tr with the given value', function () {
    let trElement = document.createElement('tr');
    appendTd(trElement, 'testing');

    expect(trElement.children.length).toEqual(1);
    expect(trElement.children[0].innerText).toEqual('testing');
  });

  it('should append a delete button to a given tr element', function () {
    let trElement = document.createElement('tr');
    appendDeleteBtn(trElement);

    expect(trElement.children.length).toEqual(1);
    expect(trElement.children[0].innerText).toEqual('X');
  });
});

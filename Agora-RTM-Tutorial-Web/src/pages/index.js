$(() => {
  const submit = (e) => {
    e.preventDefault();
    const accountName = $("#accountName").val();
    const roomId = $("#roomId").val();
    if(!accountName) {
      $("#accountNameRequired").css({
        "display": "block"
      });
      return;
    }
    $(location).attr('href', `/meeting?account=${accountName}&roomid=${roomId}`);
  }
  $("#form").on('submit', submit);
  $("#submit").on("keypress", submit);
})

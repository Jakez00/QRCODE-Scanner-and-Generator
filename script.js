$('#generator').on('click', '#downloadqr', function() {
    var data = $('#datagenerator').val();
    var url = 'https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=' + data;
    
        $.get(url, function(response) {
            var xhr = new XMLHttpRequest();
                xhr.open('GET', url , true);
                xhr.responseType = 'blob';
                xhr.onload = function(e) {
                    if (this.status == 200) {
                        var blob = new Blob([this.response], {type: 'image/png'});
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = 'qrcode.png';
                        link.click();
                    }
                };
                xhr.send();
        });
    });

    $('#generator').on('input','#datagenerator',function(){
        var data = $(this).val()
        var qrcodegenerated = 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl='+data
        
        $('#generatedqr').attr('src', qrcodegenerated)
    })

    const html5QrCode = new Html5Qrcode("reader");
    var scancontrol = false;

    $('#exampleModal').on('change','#formFile',function(e){
        
        const result = html5QrCode.scanFileV2(e.target.files[0])
        result.then(data => {
            $('#textresult').text(data.result.text);
        }).catch(error =>{
            alert('Invalid Format')
        });

    })

    $('#exampleModal').on('click','.startscanner',function(){
        scancontrol = true;
        $('#formFile').val('')
        $('#reader').addClass('mb-2');
        $(this).text('Stop Scanner');
        $(this).removeClass('startscanner').addClass('endscanner');
        $('#formFile').hide()

        const qrCodeSuccessCallback = (decodedText) => {
            html5QrCode.pause();

            $(this).text('Resume Scanner')
            $(this).removeClass('endscanner').addClass('resumescanner');
            $('#textresult').text(decodedText);
        };

        const config = { fps: 20, qrbox: { width: 250, height: 250 } };
        html5QrCode.start({ facingMode: "user" }, config, qrCodeSuccessCallback);

    })

    $('#exampleModal').on('click','.endscanner',function(){
        html5QrCode.stop();
        scancontrol = false;
        $('#formFile').show()

        $('#reader').removeClass('mb-2');
        $(this).text('Start Scanner');
        $(this).removeClass('endscanner').addClass('startscanner');
    })

    $('#exampleModal').on('click','.resumescanner',function(){
        html5QrCode.resume();

        $(this).text('Stop Scanner');
        $(this).removeClass('resumescanner').addClass('endscanner');
    })

    $("#exampleModal").on("hidden.bs.modal", function(){
        if(scancontrol == true){
            html5QrCode.stop();
            scancontrol = false
        }
        $('#formFile').show()
        $('.endscanner').text('Start Scanner')
        $('.resumescanner').text('Start Scanner')
        $('.endscanner').removeClass('endscanner').addClass('startscanner')
        $('.resumescanner').removeClass('resumescanner').addClass('startscanner')
    })
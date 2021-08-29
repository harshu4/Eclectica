function circle_buy(nft,amount){
    window.open(`https://circlep.b-cdn.net/?action=buy&owner=${window.config1.host}&nft=${nft}&amount=${amount}`,'popUpWindow','height=800,width=600,left=100,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no, status=yes');
}

function circle_load_balance(){
    window.open('https://circlep.b-cdn.net/','popUpWindow','height=800,width=600,left=100,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no, status=yes');
}

function circle_payout(){
    window.open('https://circlep.b-cdn.net/?action=payout','popUpWindow','height=800,width=600,left=100,top=100,resizable=no,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no, status=yes');
}

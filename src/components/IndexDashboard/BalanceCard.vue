<template>
    <div class="card-wrapper">
        <div class="card">
            <div class="card-icon">
                <img src="../../assets/balance.svg" height="85px" width="85px" />
            </div>

            <div class="card-text">
                <div class="text-right">
                    <p>Balance</p>
                    <h3>$1350000.98</h3>
                </div>
                
            </div>
            <hr class="card-devider">
            <div class="card-text">

            </div>
        </div>
    </div>    
</template>

<style scoped>

.card-wrapper {
    height: 200px;
    position: relative;
    box-sizing: inherit;
    display: flex;
    flex-grow: 0,1;
    width: inherit;
    
}

.card {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: white;
    border-color: white;
    border-radius: 3px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 1px 4px 0px;
   
    height: 85%;
}

.card-icon {
    position: absolute;
    top: -30px;
    left: 10px;
    width: 85px;
    height: 85px;
    /* border-color: rgb(255, 152, 0); */
    /* background-image: linear-gradient(60deg, rgb(255, 167, 38), rgb(251, 140, 0)); */
    border-radius: 3px;
    /* box-shadow: rgba(255, 152, 0, 0.28) 0px 12px 20px -10px, rgba(0, 0, 0, 0.12) 0px 4px 20px 0px, rgba(255, 152, 0, 0.2) 0px 7px 8px -5px; */
}

.card-text{
    display: flex;
    flex-direction: column;
    justify-content: flex-start; 
    text-align: right;
    padding-top: 10px;
    position: relative;  
    padding: 16px;
    padding-top: 10px;
    margin-left: 20px;  
}
.card-text p {
    font-size: 14px!important;
    font-family: Roboto,sans-serif;
    line-height: 1.5;
    font-weight: 300!important;
    caret-color: #9e9e9e!important;
    color: #9e9e9e!important;
    
}

.card-text h3 {
    margin: 0!important;
    line-height: 1.5em!important;
    letter-spacing: 0!important;
    font-size: 1.5625rem!important;
    font-weight: 300!important;
    color: rgba(0,0,0,.87);
}

.card-devider {
    margin-left: 10px;
    margin-right: 10px;
    color: rgba(0,0,0,.87);
    background-color: #b3d4fc;
}
</style>

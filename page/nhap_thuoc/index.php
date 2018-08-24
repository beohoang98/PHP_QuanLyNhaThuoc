<style media="screen">
    body {
        background-color: #f8f8f8;
    }
    #tag {
        border: 1px solid #ccccff;
    }
    .tag {
        margin: 0.5em;
    }
</style>
<div class="bg-dark text-center text-light">
    <h2>KHO THUỐC</h2>
</div>
<div class="container d-flex flex-column postition-relative">
    
    <!-- DANH SACH THUOC -->
    <div class="flex-grow-1">
        <table id='nhap_thuoc--table' class="table table-striped flex-grow-1" component='Thuoc' component-type='table'>
            <thead>
                <tr>
                    <th>Ma thuoc</th>
                    <th>Ten Thuoc</th>
                    <th>Nha cung cap</th>
                    <th>Don Gia</th>
                    <th>So luong</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>    
    </div>  
    

    <div class="position-absolute w-100 d-flex flex-row justify-content-around" style="bottom: 1em">

        <!-- NHAP MOI -->
        <button class="btn btn-default">
            NHAP MOI<br>Ctrl-N
        </button>

        <!-- NHAP THEM -->
        <button class="btn btn-default" disabled>
            NHAP THEM<br>Ctrl-A
        </button>

        <!-- EDIT -->
        <button class="btn btn-default" disabled>
            CHINH SUA<br>Ctrl-E
        </button>

        <!-- DIEU CHINH GIA -->
        <button class="btn btn-default" disabled>
            DIEU CHINH GIA
        </button>

    </div>

</div>

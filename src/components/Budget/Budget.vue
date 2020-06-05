<template>
    <div>
        <h1>Budget</h1>
    </div>
</template>

<script>

  export default {

    data: () => ({
      columns: ['name', 'code'],
      myData: [
         {
          name: 'Mick',
          code: 123
        },
        {
          name: 'Nadya',
          code: 124
        }
      ],
      options: {
        headings: {
          name: 'Country Name',
          code: 'Country Code',
          uri: 'View Record'
        },
        editableColumns:['name'],
        sortable: ['name', 'code'],
        filterable: ['name', 'code']
      }
    }),
  }
</script>

<style scoped>

</style>
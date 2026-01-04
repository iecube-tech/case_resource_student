<template>
  <my-header :name="name" @goHome="goHome" @goBack="goBack"></my-header>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const props = defineProps({
  name: {
    type: String,
    default: '实验过程评价系统'
  }
})

// console.log(route.meta)

const backRouteName = ref(route.meta.from)

const goBack = () => {
  router.push({
    name: backRouteName.value ? backRouteName.value : 'courseAnalysisStudent',
    params: {
      projectId: route.params.projectId,
      studentId: route.params.studentId
    }
  })
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped></style>